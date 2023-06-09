import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { Label } from '@/Atoms/Label';
import { Button } from '@/Atoms/Button';

import { EventCard } from '@/Molecules/Cards/EventCard';
import { CreateEventProcess } from '@/Molecules/CreateEventProcess';
import { DeployEvent } from '@/Molecules/Modals/DeployEvent';

import { Event } from '@/redux/event/types';
import { useAppSelector } from '@/redux/hooks';

import { ROUTES } from '@/config/routes';
import { BsPencil } from 'react-icons/bs';
import { Icon } from '@/Atoms/Icon';

const EventDetails = () => {
  const router = useRouter();
  const [currentEventSlug, setCurrentEventSlug] = useState<string>();
  const [event, setEvent] = useState<Event>();
  const [published, setPublished] = useState<boolean>(false);
  const [hasPass, setHasPass] = useState<boolean>(false);
  const [hasPassCategory, setHasPassCategory] = useState<boolean>(false);
  const [eventProgress, setEventProgress] = useState<string>('default');
  const [showModal, setShowModal] = useState(false);
  const [cardImgURL, setCardImgURL] = useState('');
  const currentEvent = useAppSelector((state) => state.event.current);
  const currentPassCategories = useAppSelector(
    (state) => state.passCategory.passCategories,
  );
  const queryString = router.query;

  useEffect(() => {
    const slug = queryString.eventSlug;

    if (slug != undefined && typeof slug === 'string') {
      setCurrentEventSlug(slug);
    }
  }, [queryString]);

  useEffect(() => {
    const tempCurrentEvent = currentEvent;

    if (tempCurrentEvent) {
      const tempPublished = tempCurrentEvent.published;
      const tempEvent = tempCurrentEvent.event;
      const tempHaspass = tempCurrentEvent.hasPass;

      if (tempEvent?.Files) {
        tempEvent.Files.map((file) => {
          if (file.type === 'Cover') {
            const tempCoverURL = file.url;
            setCardImgURL(tempCoverURL);
          }
        });
      }

      if (tempEvent) setEvent(tempEvent);
      if (tempPublished) {
        setPublished(tempPublished);
      } else setPublished(false);

      setHasPass(tempHaspass);
    }
  }, [currentEvent]);

  useEffect(() => {
    if (currentPassCategories.length) {
      setHasPassCategory(true);
    }
  }, [currentPassCategories]);

  useEffect(() => {
    const setupProgress = (): string => {
      if (published) {
        return 'deployed';
      } else if (hasPass) {
        return 'pass-created';
      } else if (hasPassCategory) {
        return 'setup-pass-categories';
      }

      return 'default';
    };

    const tempProgressValue = setupProgress();
    setEventProgress(tempProgressValue);
  }, [published, hasPass, hasPassCategory]);

  const HandleCloseModal = (txHash: string) => {
    setShowModal(false);
    if (published || txHash !== '') {
      router.push(ROUTES.home());
    } else
      toast.warn(`Feel free to try deploying again whenever you are ready!`);
  };

  return (
    <div className="flex flex-col items-start py-4 sm:py-5 md:flex-row">
      <div className="block w-full md:w-3/6">
        <div className="flex flex-col">
          <Label className="flex items-center justify-between mb-4">
            <h3 className="section-title line-clamp-1">
              <span className="max-w-lg truncate w-[24px]" title={event?.title}>
                {event?.title}
              </span>
              <span className="self-center inline-block px-3 py-1 ml-2 text-xs font-medium text-blue-800 bg-blue-100 rounded-full w-fit">
                {published ? 'Published' : 'Draft'}
              </span>
            </h3>

            {!published && (
              <Button
                type="button"
                bgColor="bg-blue-100"
                textProperties="text-blue-800 hover:text-blue-600"
                onClick={() => setShowModal(true)}
                padding="px-4 py-1.5 mr-2"
                width="w-fit"
                disabled={!hasPassCategory}
              >
                Deploy
              </Button>
            )}

            {showModal && currentEvent && (
              <DeployEvent
                modalTitle="Deploy Contract"
                isModalOpen={showModal}
                handleCloseModal={HandleCloseModal}
              />
            )}
          </Label>

          <div className="mb-8">
            <div className="mt-4 mr-2 text-sm">
              <span className="flex mb-1 text-base font-medium">
                Description:
                {!event?.description && (
                  <Button
                    onClick={() =>
                      currentEventSlug &&
                      router.push(ROUTES.events.edit(currentEventSlug))
                    }
                    display="inline-flex"
                    padding="px-4 py-2 ml-auto mr-5"
                    width="w-fit"
                    border="border-0"
                    bgColor=""
                  >
                    <Icon
                      title="add description"
                      className="w-5 h-5 hover:text-blue-600"
                      icon={BsPencil}
                    />
                  </Button>
                )}
              </span>

              <span>{event?.description}</span>
            </div>
          </div>

          <CreateEventProcess progress={eventProgress} />
        </div>
      </div>

      <div className="relative block w-full mt-4 md:w-3/6 md:mt-0">
        <div className="flex flex-row justify-start mb-4 gap-x-4 md:justify-end">
          <Button
            type="button"
            display={
              currentEvent?.hasPass || published
                ? 'inline-flex items-center justify-center'
                : 'hidden'
            }
            disabled={published}
            onClick={() =>
              currentEventSlug &&
              router.push(ROUTES.passCategory.view(currentEventSlug))
            }
            padding="px-4 py-2"
            width="w-fit"
          >
            Pass Tokens
          </Button>

          <Button
            type="button"
            display={
              !currentEvent?.hasPass && !published
                ? 'inline-flex items-center justify-center'
                : 'hidden'
            }
            onClick={() =>
              currentEventSlug &&
              router.push(ROUTES.passes.create(currentEventSlug))
            }
            padding="px-4 py-2"
            width="w-fit"
          >
            Create Pass
          </Button>

          <Button
            type="button"
            disabled={published}
            onClick={() =>
              currentEventSlug &&
              router.push(ROUTES.events.edit(currentEventSlug))
            }
            bgColor="bg-black hover:bg-gray-700"
            padding="px-4 py-2"
            textProperties="text-sm text-white"
            width="w-fit"
          >
            Edit Event
          </Button>
        </div>

        {event && (
          <EventCard
            title={event.title}
            description={event.description}
            startDate={event.startDate}
            endDate={event.endDate}
            imgURL={cardImgURL}
          />
        )}
      </div>
    </div>
  );
};

export default EventDetails;
